export class encriptacion{
  static desEncriptar(sEncriptado) {
    let sReturn = "";
    const iConstantes = [78, 79, 82, 77, 65, 76, 75, 69, 89, 78, 79, 82, 77, 65, 76, 75, 69, 89, 78, 79, 82, 77, 65, 76, 75, 69, 89, 78, 79, 82, 77, 65, 76, 75, 69, 89, 78];
    let j = 0;
  
    for (let i = 0; i < sEncriptado.length; i += 2) {
        sReturn += String.fromCharCode(parseInt(sEncriptado.substring(i, i + 2), 16) - iConstantes[j]);
        j++;
    }
  
    return sReturn;
  }

  static encriptar(sEncriptar) {
    let sReturn = "";
    const iConstantes = [78, 79, 82, 77, 65, 76, 75, 69, 89, 78, 79, 82, 77, 65, 76, 75, 69, 89, 78, 79, 82, 77, 65, 76, 75, 69, 89, 78, 79, 82, 77, 65, 76, 75, 69, 89, 78];
  
    for (let i = 0; i < sEncriptar.length; i++) {
        sReturn += (sEncriptar.charCodeAt(i) + iConstantes[i]).toString(16).toUpperCase();
    }
  
    return sReturn;
  }
}