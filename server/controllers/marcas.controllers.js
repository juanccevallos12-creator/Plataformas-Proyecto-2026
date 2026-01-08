import prisma from '../config/prisma.js';

export const getMarcas = async (req, res) => {
  try {
    const marcas = await prisma.marca.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });
    
    res.json({
      status: 'success',
      data: marcas
    });
  } catch (error) {
    console.error('Error obteniendo marcas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener marcas'
    });
  }
};

export const getMarcaById = async (req, res) => {
  try {
    const marca = await prisma.marca.findUnique({
      where: { id: req.params.id }
    });
    
    if (!marca) {
      return res.status(404).json({
        status: 'error',
        message: 'Marca no encontrada'
      });
    }
    
    res.json({
      status: 'success',
      data: marca
    });
  } catch (error) {
    console.error('Error obteniendo marca:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener marca'
    });
  }
};

export const createMarca = async (req, res) => {
  try {
    const marca = await prisma.marca.create({
      data: req.body
    });
    
    res.status(201).json({
      status: 'success',
      data: marca
    });
  } catch (error) {
    console.error('Error creando marca:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear marca'
    });
  }
};

export const updateMarca = async (req, res) => {
  try {
    const marca = await prisma.marca.update({
      where: { id: req.params.id },
      data: req.body
    });
    
    res.json({
      status: 'success',
      data: marca
    });
  } catch (error) {
    console.error('Error actualizando marca:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar marca'
    });
  }
};

export const deleteMarca = async (req, res) => {
  try {
    await prisma.marca.delete({
      where: { id: req.params.id }
    });
    
    res.json({
      status: 'success',
      message: 'Marca eliminada'
    });
  } catch (error) {
    console.error('Error eliminando marca:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar marca'
    });
  }
};