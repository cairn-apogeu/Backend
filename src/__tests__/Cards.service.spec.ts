import { CardsDto, CardsSchema } from '../modules/Cards/schemas/create-Cards.schema';
import CardsService from '../modules/Cards/Cards.service';
import prisma from '../clients/prisma.client';



describe('Cards Service', () => {
  beforeAll(async () => {
    // Configurações iniciais, como limpar o banco de dados de teste
    await prisma.cards.deleteMany();
  });

  afterAll(async () => {
    // Fechar a conexão do Prisma após os testes
    await prisma.$disconnect();
  });

  it('deve criar um novo card', async () => {
    const cardData: CardsDto = {
      titulo: 'Título do Card',
      status: 'novo',
    };

    const card = await CardsService.create(cardData);

    expect(card).toHaveProperty('id');
    expect(card.titulo).toBe('Título do Card');
    expect(card.status).toBe('novo');
  });

  it('não deve criar um card sem título', async () => {
    const cardData: Partial<CardsDto> = {
      status: 'novo',
    };

    await expect(CardsService.create(cardData as CardsDto)).rejects.toThrow();
  });

  it('deve listar todos os cards', async () => {
    const cards = await CardsService.findAll();

    expect(Array.isArray(cards)).toBeTruthy();
  });

  it('deve encontrar um card pelo ID', async () => {
    const cardData: CardsDto = {
      titulo: 'Card para Buscar',
      status: 'em andamento',
    };

    const newCard = await CardsService.create(cardData);
    const foundCard = await CardsService.findById(newCard.id);

    expect(foundCard).toHaveProperty('id', newCard.id);
    expect(foundCard.titulo).toBe('Card para Buscar');
  });

  it('deve atualizar um card', async () => {
    const cardData: CardsDto = {
      titulo: 'Título Antigo',
      status: 'novo',
    };

    const newCard = await CardsService.create(cardData);
    const updatedCard = await CardsService.update(newCard.id, { titulo: 'Título Atualizado' });

    expect(updatedCard.titulo).toBe('Título Atualizado');
  });

  it('deve deletar um card', async () => {
    const cardData: CardsDto = {
      titulo: 'Card para Deletar',
      status: 'concluído',
    };

    const newCard = await CardsService.create(cardData);
    await CardsService.delete(newCard.id);

    await expect(CardsService.findById(newCard.id)).rejects.toThrow('Falha ao encontrar o card');
  });

  it('deve encontrar cards atribuídos a um usuário', async () => {
    const cardData: CardsDto = {
      titulo: 'Card do Usuário',
      status: 'novo',
      assigned: 'user123',
    };

    await CardsService.create(cardData);
    const cards = await CardsService.findByAssignedUser('user123');

    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].assigned).toBe('user123');
  });

  it('deve encontrar cards por sprint', async () => {
    const cardData: CardsDto = {
      titulo: 'Card do Sprint',
      status: 'novo',
      sprint: 1,
    };

    await CardsService.create(cardData);
    const cards = await CardsService.findBySprint(1);

    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].sprint).toBe(1);
  });
});