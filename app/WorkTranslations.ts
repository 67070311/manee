import type {WorkProject} from "./WorkProjects";
type Localized={subtitle:string;description:string;focus:string;skills?:string[]};
const translations:Record<string,Localized>={
 "01":{subtitle:"เว็บไซต์ท่องโลกใต้ทะเลที่ชวนให้ออกไปสำรวจ",description:"เว็บไซต์ Nice Dive Club ออกแบบให้ข้อมูลคอร์สและทริปดำน้ำค้นหาได้ง่าย พร้อมบรรยากาศที่ถ่ายทอดความสวยงามของท้องทะเล",focus:"UX/UI · Frontend · เว็บไซต์",skills:["UX/UI","Frontend","ออกแบบเว็บไซต์"]},
 "02":{subtitle:"พื้นที่รวมไอเดียและโปรดักต์ดิจิทัลของ BuildifyX",description:"เว็บไซต์ BuildifyX ที่รวบรวมโปรดักต์ งานพัฒนา และเรื่องราวของทีมไว้ในประสบการณ์เดียว",focus:"ออกแบบโปรดักต์ · UX/UI · Frontend"},
 "03":{subtitle:"ผู้ช่วย AI สำหรับการทำงานกับโปรเจกต์บนเครื่อง",description:"รับผิดชอบการออกแบบ UX/UI และพัฒนา Frontend ของ BDXA เพื่อให้การทำงานกับ AI และโปรเจกต์ผ่านหน้าเว็บใช้งานง่ายและชัดเจน",focus:"UX/UI · Frontend",skills:["UX/UI","Frontend"]},
 "04":{subtitle:"ออกแบบ UX/UI และกราฟิกให้ประสบการณ์ช้อปปิ้งออนไลน์",description:"รับผิดชอบการออกแบบ UX/UI และงานกราฟิกของ Friday Online ให้ภาพรวมสอดคล้องกับแบรนด์และใช้งานง่าย โดยไม่ได้เป็นผู้พัฒนาหรือ Deploy เว็บไซต์",focus:"ออกแบบ UX/UI · Graphic Design",skills:["ออกแบบ UX/UI","Graphic Design","Visual Design"]},
 "05":{subtitle:"ดีไซน์เว็บไซต์องค์กรและกราฟิกให้เข้ากับแบรนด์",description:"ออกแบบ UX/UI และงานกราฟิกสำหรับ Better Way โดยเน้นการจัดลำดับเนื้อหาและภาพลักษณ์ของแบรนด์ งานนี้รับผิดชอบเฉพาะการออกแบบและกราฟิก ไม่รวมการพัฒนาหรือ Deploy เว็บไซต์",focus:"ออกแบบ UX/UI · Graphic Design",skills:["ออกแบบ UX/UI","Graphic Design","Visual Design"]},
 "06":{subtitle:"ออกแบบประสบการณ์เว็บไซต์องค์กรระดับสากล",description:"รับผิดชอบงานออกแบบ UX/UI ของ Fusecorp โดยเน้นโครงสร้างข้อมูล การนำทาง และภาพลักษณ์เว็บไซต์องค์กร ไม่รวมการพัฒนาหรือ Deploy",focus:"ออกแบบ UX/UI",skills:["ออกแบบ UX/UI"]},
 "08":{subtitle:"เว็บไซต์ระบบติดตามรถด้วย GPS ที่เข้าใจง่ายและใช้งานสะดวก",description:"เว็บไซต์ R&K Technology ที่นำเสนอโซลูชัน GPS Tracking และการติดตามยานพาหนะ ผ่านการจัดวางข้อมูลบริการและคุณสมบัติระบบอย่างเป็นระเบียบ",focus:"UX/UI · Frontend · เว็บไซต์องค์กร",skills:["UX/UI","Frontend","เว็บ Responsive","ออกแบบเว็บไซต์"]},
 "10":{subtitle:"ระบบ POS ที่ทำให้งานหน้าร้านง่ายขึ้น",description:"รับผิดชอบ UX/UI, Frontend และ Backend ของโปรดักต์ POS สำหรับจัดการออเดอร์ โต๊ะ และกระบวนการทำงานภายในร้าน โดยไม่ได้ระบุงาน Deploy เป็นส่วนที่รับผิดชอบ",focus:"UX/UI · Frontend · Backend",skills:["UX/UI","Frontend","Backend"]},
 "07":{subtitle:"ออกแบบ UX/UI สำหรับบริการ Wisdom Topup",description:"รับผิดชอบงานออกแบบ UX/UI ของ Wisdom Topup เพื่อให้ผู้ใช้งานค้นหาข้อมูลและเข้าถึงบริการได้อย่างสะดวก ไม่รวมการพัฒนาหรือ Deploy",focus:"ออกแบบ UX/UI",skills:["ออกแบบ UX/UI"]},
 "11":{subtitle:"เกมเอาตัวรอดในโลกสัตว์สุดน่ารัก",description:"เกมต้นแบบบนเว็บที่มีตัวละคร ศัตรู จอยสติก ระบบเลเวลและอัปเกรด",focus:"ออกแบบเกม · Frontend · Interaction",skills:["ออกแบบเกม","Canvas","ระบบเกม"]},
 "12":{subtitle:"เริ่มจากร้านเฟรนช์ฟรายส์ แล้วสร้างร้านอาหารในแบบเรา",description:"เกมบริหารร้านอาหารสไตล์ Pixel Art ที่มีลูกค้า ออเดอร์ อัปเกรดร้าน และเลเวล",focus:"ออกแบบเกม · Pixel UI · Frontend",skills:["เกม Idle","UI เกม","JavaScript"]},
 "13":{subtitle:"ทดลองปรุงเวทมนตร์ในโลกเกมแฟนตาซี",description:"ต้นแบบเกมปรุงยาวิเศษด้วย Next.js และ React Three Fiber",focus:"พัฒนาเกม · 3D · Interaction",skills:["React Three Fiber","Next.js","ออกแบบเกม"]},
 "14":{subtitle:"สตูดิโอวาดภาพเล็ก ๆ กลางป่า",description:"เกมวาดรูปที่ลูกค้าสัตว์เดินมาสั่งภาพ ผู้เล่นลงมือวาด ต่อรองราคา เก็บเหรียญและสร้างชื่อเสียง",focus:"ออกแบบเกม · Creative Coding · Frontend",skills:["Canvas","ออกแบบเกม","Creative Coding"]},
 "15":{subtitle:"สำรวจกายวิภาคผ่านเรื่องเล่าแบบโต้ตอบ",description:"เว็บทดลองแสดงภาพกายวิภาคผ่านการเลื่อนหน้าและเอฟเฟกต์เปิดเผยภาพด้วยตัวชี้เมาส์",focus:"Creative Frontend · Interactive Storytelling",skills:["เว็บอินเทอร์แอ็กทีฟ","Scroll Effects","Art Direction"]},
 "16":{subtitle:"ใช้แปรงเปิดเผยโลกอีกชั้นของภาพ",description:"เว็บทดลองระบายเพื่อเปิดเผยภาพ มีโหมดวัสดุหลายแบบ เปรียบเทียบก่อนและหลัง และบันทึกผลงานได้",focus:"Creative Coding · UX/UI · Interaction",skills:["Canvas","Pointer Interaction","Creative Coding"]}
};
export function localizeProject(project:WorkProject,language:"en"|"th"):WorkProject{
 if(language==="en")return project;
 const translated=translations[project.id];return translated?{...project,...translated}:project;
}
