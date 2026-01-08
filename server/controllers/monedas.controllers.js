import prisma from '../config/prisma.js';

export const getMonedas = async (req, res) => {
  try {
    const monedas = await prisma.moneda.findMany({
      where: { activo: true },
      orderBy: { codigo: 'asc' }
    });
    
    res.json({
      status: 'success',
      data: monedas
    });
  } catch (error) {
    console.error('Error obteniendo monedas:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener monedas'
    });
  }
};

export const getMonedaById = async (req, res) => {
  try {
    const moneda = await prisma.moneda.findUnique({
      where: { id: req.params.id }
    });
    
    if (!moneda) {
      return res.status(404).json({
        status: 'error',
        message: 'Moneda no encontrada'
      });
    }
    
    res.json({
      status: 'success',
      data: moneda
    });
  } catch (error) {
    console.error('Error obteniendo moneda:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener moneda'
    });
  }
};

export const createMoneda = async (req, res) => {
  try {
    const moneda = await prisma.moneda.create({
      data: req.body
    });
    
    res.status(201).json({
      status: 'success',
      data: moneda
    });
  } catch (error) {
    console.error('Error creando moneda:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear moneda'
    });
  }
};

export const updateMoneda = async (req, res) => {
  try {
    const moneda = await prisma.moneda.update({
      where: { id: req.params.id },
      data: req.body
    });
    
    res.json({
      status: 'success',
      data: moneda
    });
  } catch (error) {
    console.error('Error actualizando moneda:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar moneda'
    });
  }
};

export const deleteMoneda = async (req, res) => {
  try {
    await prisma.moneda.delete({
      where: { id: req.params.id }
    });
    
    res.json({
      status: 'success',
      message: 'Moneda eliminada'
    });
  } catch (error) {
    console.error('Error eliminando moneda:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar moneda'
    });
  }
};