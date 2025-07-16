const { contemTermosProibidos } = require('./validador');

describe('Filtro de Palavras Proibidas', () => {
  it('deve detectar uma ofensa', () => {
    expect(contemTermosProibidos('esse cara é um babaca')).toBe(true);
  });
});