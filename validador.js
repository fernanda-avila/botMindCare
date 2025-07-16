function contemTermosProibidos(texto) {
  const palavras = ['babaca', 'viado', 'estuprador'];
  return palavras.some(p => texto.toLowerCase().includes(p));
}

module.exports = { contemTermosProibidos };