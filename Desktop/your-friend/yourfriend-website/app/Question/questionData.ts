export type Trait = "self-awareness" | "adaptability" | "resilience";

export type JourneyChoice = {
  id: string;
  label?: string;
  text: string;
  nextId: string;
  trait?: Trait;
};

export type JourneyNode = {
  id: string;
  type: "question" | "message";
  stepLabel: string;
  eyebrow?: string;
  title: string;
  prompt?: string;
  choices?: JourneyChoice[];
  nextId?: string;
  showChoiceLabels?: boolean;
};

export const START_NODE_ID = "future-fog";

export const journeyNodes: Record<string, JourneyNode> = {
  "future-fog": {
    id: "future-fog",
    type: "question",
    stepLabel: "1 / 3",
    eyebrow: "ฮัลโหล...",
    title: "วันนี้เรามาเริ่มออกเดินทางกันนะ",
    prompt: "พอมองไปที่อนาคตเรื่องเรียนจบหรือตอนหางาน เธอรู้สึกว่ามันเหมือน ‘หมอก’ แบบไหนหรอ?",
    showChoiceLabels: true,
    choices: [
      { id: "fog-a", label: "A", text: "หมอกหนาทึบ... มองไม่เห็นอะไรเลย กลัวก้าวพลาด", nextId: "branch-a" },
      { id: "fog-b", label: "B", text: "หมอกสีขาว... ทางมันเยอะจนตาลาย เลือกไม่ถูก", nextId: "branch-b" },
      { id: "fog-c", label: "C", text: "หมอกจาง ๆ... เห็นทางนะ แต่ไม่มั่นใจว่าตัวเองจะเดินไหวไหม", nextId: "branch-c" },
    ],
  },
  "branch-a": {
    id: "branch-a",
    type: "question",
    stepLabel: "2 / 3",
    title: "ตอนเราเดินในที่มืดจริง ๆ เราไม่ต้องเห็นทางไกล ๆ ถึง 10 กิโลฯ หรอก ขอแค่เห็น ‘ที่วางเท้า’ ก้าวต่อไปก็พอแล้ว...",
    prompt: "ถ้าสมมติว่าตอนนี้ไม่ต้องคิดไกลถึงอนาคต เอาแค่ ‘พรุ่งนี้’ เธอพอจะเห็นไหมว่าอยากทำอะไรให้ตัวเองใจฟูขึ้น\u2060สักนิด?",
    showChoiceLabels: false,
    choices: [
      { id: "a-have-idea", text: "พอมีเรื่องที่อยากทำอยู่บ้างนะ", nextId: "encourage-more" },
      { id: "a-stuck", text: "ยังนึกไม่ออกเลย แอบตื้อ ๆ", nextId: "encourage-more" },
    ],
  },
  "branch-b": {
    id: "branch-b",
    type: "question",
    stepLabel: "2 / 3",
    title: "โอ้โห ทางเลือกเยอะไปหมดก็แอบเหนื่อยเหมือนกันนะเนี่ย...",
    prompt: "งั้นถ้าเราลองเปลี่ยนจากความรู้สึกที่ว่า ‘ต้องเลือกทางที่ถูกที่สุด’ เป็นคำว่า ‘ลองเดินไปดูสักทางก่อน ถ้าไม่ใช่ค่อยเดินกลับ’ เธอคิดว่ามันทำให้ก้าวขาง่ายขึ้นไหม?",
    showChoiceLabels: false,
    choices: [
      { id: "b-agree", text: "เออ จริงด้วย!", nextId: "encourage-more" },
      { id: "b-still-afraid", text: "ก็ยังกลัวผิดอยู่ดีอ่ะ", nextId: "encourage-more" },
    ],
  },
  "branch-c": {
    id: "branch-c",
    type: "question",
    stepLabel: "2 / 3",
    title: "แอบกระซิบนะ... ทุกคนที่กำลังเดินอยู่ตรงนั้น ก็ขาสั่นเหมือนกันแหละ 555 ความกังวลแปลว่าเราใส่ใจกับมันไง...",
    prompt: "ถ้าสมมติมีคนเดินมาบอกว่า ‘ทางนี้เธอทำได้แน่นอน’ เธอจะกล้าลองเดินไปไหม ทั้งที่ลึก ๆ ก็ยังแอบกลัวอยู่?",
    showChoiceLabels: false,
    choices: [
      { id: "c-try", text: "กล้าสิ! ลองดู", nextId: "encourage-more" },
      { id: "c-wait", text: "ขอทำใจแป๊บนึงนะ", nextId: "encourage-more" },
    ],
  },
  "encourage-more": {
    id: "encourage-more",
    type: "message",
    stepLabel: "2 / 3",
    title: "เยี่ยมเลย ถามเพิ่มหน่อยสิ",
    nextId: "fog-tomorrow",
  },
  "fog-tomorrow": {
    id: "fog-tomorrow",
    type: "question",
    stepLabel: "3 / 3",
    title: "ถ้าสมมติว่าพรุ่งนี้ตื่นมา หมอกมันยังหนาอยู่ และยังไม่จาง\u2060หายไป...",
    prompt: "เธอคิดว่าตัวเองน่าจะทำยังไงต่อหรอ สัญญาว่าจะไม่ตัดสินเลย เอาที่รู้สึกจริง ๆ นะ",
    showChoiceLabels: false,
    choices: [
      { id: "self-awareness", text: "ก็คงยืนรอไปก่อน... ขอชัวร์กว่านี้แล้วค่อยเดิน", nextId: "closing", trait: "self-awareness" },
      { id: "adaptability", text: "ลองก้าวสั้น ๆ ดูก่อน ผิดทางก็แค่ค่อยกลับมา", nextId: "closing", trait: "adaptability" },
      { id: "resilience", text: "หลับตาแล้วพุ่งชนเลยละกัน ทนยืนเฉย ๆ ไม่ไหวแล้ว", nextId: "closing", trait: "resilience" },
    ],
  },
  closing: {
    id: "closing",
    type: "message",
    stepLabel: "เสร็จแล้ว",
    title: "ไม่ว่าเธอจะเลือกแบบไหนก็ไม่ผิดเลยนะ การยอมรับว่าตัวเองกำลังรู้สึกยังไง คือความกล้าหาญที่สุดแล้ว",
    prompt: "วันนี้เราอาจจะยังมองไม่เห็นปลายทาง แต่มันไม่เป็นไรเลยจริง ๆ... พรุ่งนี้เรามาค่อย ๆ เดินไปด้วยกันใหม่!",
  },
};
