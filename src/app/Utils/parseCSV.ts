import papa from "papaparse"

export function extractCSVStream(path: string): Promise<{ headers: string[]; parseData: any[] }> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Unable to fetch CSV");

      const text = await response.text();
      const results: any[] = [];

      const parsed = papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        chunk: (chunk: { data: any; }) => {
          results.push(...chunk.data);
        },
        complete: () => {
          resolve({
            headers: results.length > 0 ? Object.keys(results[0]) : [],
            parseData: results,
          });
        },
        error: (error : any) => {
          reject(error.message);
        },
      });
    } catch (err) {
      console.error("Stream parse failed:", err);
      reject(err);
    }
  });
}
