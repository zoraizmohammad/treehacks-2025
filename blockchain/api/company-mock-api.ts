import express from 'express';
import { utils } from 'ethers';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Mock database of encrypted records
const mockDatabase: Record<string, any[]> = {};

// Generate mock data
function generateMockData(count: number, companyId: string) {
    const data = Array(count).fill(0).map((_, index) => ({
        value: Math.floor(Math.random() * 1000),
        timestamp: Date.now(),
        index,
        companyId
    }));

    // Encrypt the data (in real world, this would be actual encryption)
    return data.map(record => {
        const jsonString = JSON.stringify(record);
        return utils.hexlify(utils.toUtf8Bytes(jsonString));
    });
}

// Endpoint to initialize mock data for a company
app.post('/api/company/init-data', (req, res) => {
    const { companyId, recordCount } = req.body;

    if (!companyId || !recordCount) {
        return res.status(400).json({
            success: false,
            error: 'Missing companyId or recordCount'
        });
    }

    mockDatabase[companyId] = generateMockData(recordCount, companyId);

    res.json({
        success: true,
        message: `Generated ${recordCount} records for company ${companyId}`,
        recordCount: mockDatabase[companyId].length
    });
});

// Endpoint to get paginated data for a company
app.get('/api/company/:companyId/data', (req, res) => {
    const { companyId } = req.params;
    const { page = '1', pageSize = '100' } = req.query;

    if (!mockDatabase[companyId]) {
        return res.status(404).json({
            success: false,
            error: 'Company data not found'
        });
    }

    const pageNum = parseInt(page as string);
    const size = parseInt(pageSize as string);
    const start = (pageNum - 1) * size;
    const end = start + size;

    const data = mockDatabase[companyId].slice(start, end);
    const totalRecords = mockDatabase[companyId].length;
    const totalPages = Math.ceil(totalRecords / size);

    res.json({
        success: true,
        data,
        pagination: {
            page: pageNum,
            pageSize: size,
            totalRecords,
            totalPages,
            hasMore: pageNum < totalPages
        }
    });
});

// Get total record count for a company
app.get('/api/company/:companyId/count', (req, res) => {
    const { companyId } = req.params;

    if (!mockDatabase[companyId]) {
        return res.status(404).json({
            success: false,
            error: 'Company data not found'
        });
    }

    res.json({
        success: true,
        companyId,
        recordCount: mockDatabase[companyId].length
    });
});

const PORT = process.env.COMPANY_API_PORT || 3002;
app.listen(PORT, () => {
    console.log(`Company mock API running on port ${PORT}`);
}); 