import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('\n🔍 DIAGNÓSTICO DE CONEXIÓN A MONGODB\n');
  console.log('━'.repeat(50));
  
  // Mostrar variables de entorno (ocultando password)
  console.log('\n📋 Variables de entorno:');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? 
    process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@') : 
    '❌ NO DEFINIDA');
  console.log('   PORT:', process.env.PORT || '❌ NO DEFINIDA');
  console.log('   NODE_ENV:', process.env.NODE_ENV || '❌ NO DEFINIDA');
  
  if (!process.env.MONGODB_URI) {
    console.error('\n❌ ERROR: MONGODB_URI no está definida en .env\n');
    process.exit(1);
  }
  
  console.log('\n━'.repeat(50));
  console.log('\n⏳ Intentando conectar a MongoDB Atlas...\n');
  
  try {
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    
    console.log('   1. Cliente creado ✓');
    console.log('   2. Conectando...');
    
    await client.connect();
    console.log('   3. Conectado ✓');
    
    const db = client.db('ecommerce');
    console.log('   4. Base de datos seleccionada ✓');
    
    await db.command({ ping: 1 });
    console.log('   5. Ping exitoso ✓');
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('\n📦 Colecciones existentes:');
    if (collections.length === 0) {
      console.log('   (ninguna - base de datos vacía)');
    } else {
      collections.forEach(col => console.log(`   • ${col.name}`));
    }
    
    await client.close();
    console.log('\n✅ CONEXIÓN EXITOSA - Todo funciona correctamente!\n');
    console.log('━'.repeat(50));
    console.log('\n💡 Puedes ejecutar la migración con:');
    console.log('   node scripts/migrateData.js\n');
    
  } catch (error) {
    console.error('\n❌ ERROR DE CONEXIÓN:\n');
    console.error('   Mensaje:', error.message);
    console.error('   Código:', error.code || 'N/A');
    console.error('   Nombre:', error.name || 'N/A');
    
    console.error('\n━'.repeat(50));
    console.error('\n🔍 POSIBLES CAUSAS Y SOLUCIONES:\n');
    
    if (error.message.includes('authentication failed')) {
      console.error('❌ Usuario o contraseña incorrectos');
      console.error('   Solución:');
      console.error('   1. Ve a Database Access en MongoDB Atlas');
      console.error('   2. Verifica que el usuario existe');
      console.error('   3. Si es necesario, edita y cambia la contraseña');
      console.error('   4. Actualiza .env con la nueva contraseña\n');
    } 
    else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('❌ No se puede alcanzar el servidor de MongoDB');
      console.error('   Solución:');
      console.error('   1. Verifica tu conexión a internet');
      console.error('   2. Verifica que el connection string sea correcto');
      console.error('   3. El hostname debe ser: dbcomercial.pgzdcmf.mongodb.net\n');
    }
    else if (error.message.includes('timed out') || error.message.includes('Server selection')) {
      console.error('❌ Timeout de conexión');
      console.error('   Solución:');
      console.error('   1. Ve a Network Access en MongoDB Atlas');
      console.error('   2. Agrega 0.0.0.0/0 (permitir todas las IPs)');
      console.error('   3. Espera 2-3 minutos para que se aplique');
      console.error('   4. Verifica tu firewall/antivirus\n');
    }
    else {
      console.error('❌ Error desconocido');
      console.error('   Detalles completos del error:\n');
      console.error(error);
      console.error('');
    }
    
    console.error('━'.repeat(50));
    console.error('\n📖 Recursos adicionales:');
    console.error('   • MongoDB Atlas: https://cloud.mongodb.com');
    console.error('   • Documentación: https://docs.mongodb.com/drivers/node\n');
    
    process.exit(1);
  }
}

testConnection();