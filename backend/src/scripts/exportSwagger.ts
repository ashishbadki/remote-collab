import fs from 'fs';
import path from 'path';
import swaggerSpec from '../config/swagger';

const outputPath = path.resolve(__dirname, '../../swagger.json');

try {
    fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
    console.log(`✅ Swagger JSON exported successfully to: ${outputPath}`);
} catch (error) {
    console.error('❌ Failed to export Swagger JSON:', error);
    process.exit(1);
}
