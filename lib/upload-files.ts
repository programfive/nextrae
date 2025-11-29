
export async function uploadFileToDrive(file: File) {
  return new Promise<unknown>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = (err) => {
      reject(err);
    };

    reader.onload = function () {
      if (typeof reader.result !== "string") {
        return reject(new Error("Invalid reader result"));
      }

      const rawLog = reader.result.split(",")[1]; // extract only the file data part
      const dataSend = {
        dataReq: { data: rawLog, name: file.name, type: file.type },
        fname: "uploadFilesToGoogleDrive",
      }; // prepare info to send to API

      fetch("/api/google-drive-upload", {
        method: "POST",
        body: JSON.stringify(dataSend),
      })
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    };

    reader.readAsDataURL(file); // start conversion...
  });
}