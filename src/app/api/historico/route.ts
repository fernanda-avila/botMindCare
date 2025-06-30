import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { user, message, sender, timestamp } = await request.json();

    await prisma.historico.create({
      data: {
        usuario: user,
        texto: message,
        remetente: sender,
        criadoEm: new Date(timestamp),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
    return NextResponse.json({ error: 'Erro ao salvar no banco de dados' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const historico = await prisma.historico.findMany({
      orderBy: { criadoEm: 'desc' },
      take: 50,
    });

    return NextResponse.json(historico);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json({ error: 'Erro ao buscar no banco de dados' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
