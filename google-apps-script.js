/** NUTT DRIVE BRIDGE - Google Apps Script
 * Deploy as Web app: Execute as Me, Who has access: Anyone with the link.
 * Create TWO deployments or use one deployment with separate folders configured below.
 * For safety, keep the web app URL private.
 */
const CONFIG={
  WORKOUT_FOLDER_ID:'PUT_WORKOUT_FOLDER_ID_HERE',
  PROJECT_FOLDER_ID:'PUT_PROJECT_FOLDER_ID_HERE',
  MAX_BYTES:50*1024*1024
};
function doGet(){return HtmlService.createHtmlOutput('<h2>NUTT Drive Bridge</h2><p>พร้อมรับไฟล์จาก NUTT Dashboard</p>');}
function doPost(e){try{
  const raw=e.parameter.payload||'{}'; const p=JSON.parse(raw);
  const rootId=p.type==='workout'?CONFIG.WORKOUT_FOLDER_ID:CONFIG.PROJECT_FOLDER_ID;
  if(!rootId||rootId.indexOf('PUT_')===0) throw new Error('ยังไม่ได้ตั้ง Folder ID');
  const root=DriveApp.getFolderById(rootId);
  const stamp=(p.date||Utilities.formatDate(new Date(),'Asia/Bangkok','yyyy-MM-dd'))+'_'+(p.time||Utilities.formatDate(new Date(),'Asia/Bangkok','HH-mm-ss')).replace(/:/g,'-');
  const folder=root.createFolder(stamp);
  const meta={type:p.type,date:p.date,time:p.time,title:p.title||'',tag:p.tag||'',desc:p.desc||'',completed:p.completed||0,note:p.note||'',savedAt:Utilities.formatDate(new Date(),'Asia/Bangkok','yyyy-MM-dd HH:mm:ss')};
  (p.files||[]).forEach(x=>{const bytes=Utilities.base64Decode(x.base64||'');if(bytes.length>CONFIG.MAX_BYTES)throw new Error('ไฟล์ใหญ่เกิน 50 MB: '+x.fileName);const blob=Utilities.newBlob(bytes,x.mimeType||'application/octet-stream',x.fileName||'upload.bin');folder.createFile(blob);});
  if(p.base64){const bytes=Utilities.base64Decode(p.base64);if(bytes.length>CONFIG.MAX_BYTES)throw new Error('ไฟล์ใหญ่เกิน 50 MB');folder.createFile(Utilities.newBlob(bytes,p.mimeType||'application/octet-stream',p.fileName||'workout.jpg'));}
  folder.createFile('record.json',JSON.stringify(meta,null,2),MimeType.PLAIN_TEXT);
  return HtmlService.createHtmlOutput('<h2>บันทึกสำเร็จ 💕</h2><p>โฟลเดอร์: '+escapeHtml_(folder.getName())+'</p><p><a target="_blank" href="'+folder.getUrl()+'">เปิด Google Drive</a></p>');
}catch(err){return HtmlService.createHtmlOutput('<h2>อัปโหลดไม่สำเร็จ</h2><p>'+escapeHtml_(String(err.message||err))+'</p>');}}
function escapeHtml_(s){return s.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
