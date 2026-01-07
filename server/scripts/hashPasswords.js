// server/scripts/hashPasswords.js

import { connectDB, closeDB } from '../config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// FIX: Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la raíz del proyecto (2 niveles arriba)
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function hashExistingPasswords() {
  try {
    console.log('\n🔐 Iniciando migración de contraseñas...\n');
    
    const db = await connectDB();
    const usuarios = await db.collection('usuarios').find().toArray();
    
    console.log(`📊 Encontrados ${usuarios.length} usuarios\n`);
    
    let hasheados = 0;
    let yaHasheados = 0;
    
    for (const usuario of usuarios) {
      // Verificar si ya está hasheada (bcrypt genera hashes que empiezan con $2b$)
      if (usuario.password && usuario.password.startsWith('$2b$')) {
        console.log(`⏭️  ${usuario.email} - Ya hasheada`);
        yaHasheados++;
      } else {
        // Hashear contraseña
        const passwordHash = await bcrypt.hash(usuario.password, 10);
        
        await db.collection('usuarios').updateOne(
          { _id: usuario._id },
          { $set: { password: passwordHash } }
        );
        
        console.log(`✅ ${usuario.email} - Contraseña hasheada`);
        hasheados++;
      }
    }
    
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║     MIGRACIÓN COMPLETADA              ║');
    console.log('╠═══════════════════════════════════════╣');
    console.log(`║  ✅ Hasheadas: ${hasheados.toString().padEnd(23)}║`);
    console.log(`║  ⏭️  Ya hasheadas: ${yaHasheados.toString().padEnd(19)}║`);
    console.log('╚═══════════════════════════════════════╝\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await closeDB();
  }
}

hashExistingPasswords();