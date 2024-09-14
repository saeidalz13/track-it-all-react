export class StringProcessor {
  public static convertTitleCase(str: string) {
    const strArr = str.toLowerCase().split(" ");
    for (let i = 0; i < strArr.length; i++) {
      strArr[i] = str[i].charAt(0).toUpperCase() + strArr[i].slice(1);
    }

    return strArr.join(" ");
  }
}
