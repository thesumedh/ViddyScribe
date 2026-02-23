export interface Description {
    id: string;
    timestamp: number;
    text: string;
}

/**
 * Parses an SRT file content string into an array of Description objects
 * with synchronized timestamps in seconds.
 */
export function parseSRT(srtContent: string): Description[] {
    const lines = srtContent.replace(/\r\n/g, '\n').split('\n');
    const descriptions: Description[] = [];

    let currentId = '';
    let currentTimestamp = 0;
    let currentText = '';
    let step = 0; // 0: id, 1: timestamp, 2: text

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '') {
            // Empty line means block is over
            if (currentText) {
                descriptions.push({
                    id: currentId || `srt-${descriptions.length}`,
                    timestamp: currentTimestamp,
                    text: currentText.trim()
                });
            }
            step = 0;
            currentId = '';
            currentTimestamp = 0;
            currentText = '';
            continue;
        }

        if (step === 0) {
            currentId = line;
            step = 1;
        } else if (step === 1) {
            // Parse timestamp line: 00:00:20,000 --> 00:00:24,400
            const times = line.split(' --> ');
            if (times.length > 0) {
                currentTimestamp = timeToSeconds(times[0]);
            }
            step = 2;
        } else if (step === 2) {
            currentText += (currentText ? ' ' : '') + line;
        }
    }

    // Push the last one if file doesn't end with empty line
    if (currentText) {
        descriptions.push({
            id: currentId || `srt-${descriptions.length}`,
            timestamp: currentTimestamp,
            text: currentText.trim()
        });
    }

    return descriptions;
}

/**
 * Converts SRT timestamp to absolute seconds
 * Format: HH:MM:SS,mmm
 */
function timeToSeconds(timeStr: string): number {
    const parts = timeStr.split(',');
    const mainTime = parts[0].split(':');

    let seconds = 0;
    if (mainTime.length === 3) {
        seconds = parseInt(mainTime[0]) * 3600 + parseInt(mainTime[1]) * 60 + parseFloat(mainTime[2]);
    }

    if (parts.length > 1) {
        seconds += parseFloat(parts[1]) / 1000;
    }

    return seconds;
}
