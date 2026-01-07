// server/scripts/normalizarImagenes.js
import { connectDB, closeDB } from '../config/database.js';

async function normalizarImagenes() {
  console.log('🔧 Normalizando rutas de imágenes en MongoDB...\n');
  
  try {
    const db = await connectDB();
    const productos = await db.collection('productos').find().toArray();
    
    let actualizados = 0;
    
    for (const producto of productos) {
      if (producto.imagen) {
        let rutaOriginal = producto.imagen;
        let rutaNueva = producto.imagen;
        
        // Remover "./" del inicio
        if (rutaNueva.startsWith('./')) {
          rutaNueva = rutaNueva.substring(2);
        }
        
        // Asegurar que empiece con "/"
        if (!rutaNueva.startsWith('/') && !rutaNueva.startsWith('http')) {
          rutaNueva = '/' + rutaNueva;
        }
        
        // Actualizar si cambió
        if (rutaNueva !== rutaOriginal) {
          await db.collection('productos').updateOne(
            { _id: producto._id },
            { $set: { imagen: rutaNueva } }
          );
          console.log(`✅ ${producto.nombre}`);
          console.log(`   Antes: ${rutaOriginal}`);
          console.log(`   Ahora: ${rutaNueva}\n`);
          actualizados++;
        }
      }
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   Total productos: ${productos.length}`);
    console.log(`   Actualizados: ${actualizados}`);
    console.log(`   Sin cambios: ${productos.length - actualizados}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await closeDB();
  }
}

normalizarImagenes();