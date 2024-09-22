export class StringProcessor {
  public static convertTitleCase(str: string) {
    const strArr = str.toLowerCase().split(" ");

    for (let i = 0; i < strArr.length; i++) {
      strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
    }

    return strArr.join(" ");
  }

  public static prepareAiInsightString(jobDesc: string): string {
    return (
      jobDesc +
      "\n\n\nBased on the job description provided above, please give me information about PLAVCHOLDER company, their mission and useful insight you might have to help me succeed in my interview with them. KEEP YOUR ANSWER LESS THAN 10000 characters please."
    );
  }
}
