import request from '@/utils/request';
import { saveAs } from 'file-saver';

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
};

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res: any, mimeType: string) {
  const blob = new Blob([res.data], { type: mimeType });
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
  const contentDisposition = decodeURI(res.headers['content-disposition']);
  const result = patt.exec(contentDisposition);
  let fileName = result ? result[1] : 'file';
  fileName = fileName.replace(/"/g, '');
  saveAs(blob,fileName)
}

export function downLoadZip(url: string) {
  request({
    url, 
    method: 'GET',
  }).then((res) => {
    resolveBlob(res, mimeMap.zip);
  });
}

export async function downLoadXlsx(url: string, params: any, fileName: string) {
  return request({
    url, 
    ...params,
    method: 'POST',
    responseType: 'blob',
  }).then((data) => {
    const blob = data as any; // new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob,fileName)
  });
}

export function download(fileName: string) {
  window.location.href = `/common/download?fileName=${encodeURI(
    fileName,
  )}&delete=${true}`;
}
