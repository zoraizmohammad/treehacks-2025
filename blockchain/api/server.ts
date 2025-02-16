import express from 'express';
import { utils } from 'ethers';
import cors from 'cors';

const app = express();
// Increase JSON payload limit to 100MB to handle all records at once
app.use(express.json({ limit: '100mb' }));
app.use(cors());

// Simulated aggregation function
function aggregateData(encryptedData: string[], type: string): number {
    // For testing, we'll decrypt the mock data and perform the requested aggregation
    const decryptedData = encryptedData.map(row => {
        const hexString = row.startsWith('0x') ? row.slice(2) : row;
        const jsonString = utils.toUtf8String('0x' + hexString);
        return JSON.parse(jsonString).value;
    });

    switch (type.toLowerCase()) {
        case 'sum':
            return decryptedData.reduce((a, b) => a + b, 0);
        case 'average':
            return decryptedData.reduce((a, b) => a + b, 0) / decryptedData.length;
        case 'count':
            return decryptedData.length;
        case 'median': {
            const sorted = [...decryptedData].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 === 0
                ? (sorted[mid - 1] + sorted[mid]) / 2
                : sorted[mid];
        }
        default:
            throw new Error(`Unsupported aggregation type: ${type}`);
    }
}

// Main aggregation endpoint
app.post('/api/aggregate', (req, res) => {
    try {
        const { requestId, aggregationType, encryptedData } = req.body;
        console.log(`Processing request ${requestId}`);
        console.log(`Aggregation type: ${aggregationType}`);
        console.log(`Number of records: ${encryptedData.length}`);

        // Perform aggregation
        const result = aggregateData(encryptedData, aggregationType);
        console.log(`Aggregation result: ${result}`);

        res.json({
            success: true,
            requestId,
            result,
            message: `Successfully aggregated ${encryptedData.length} records`
        });
    } catch (error: any) {
        console.error('Error processing request:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
}); 