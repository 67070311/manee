import {dishes, vocabulary, type EnglishMenuDish} from "./EnglishMenuData";

/** Every recipe has an authored play-through, with a purpose for every ingredient and utensil. */
export type CookingPhase="prep"|"cook"|"plate";
export type CookingStep={
 type:"ingredient"|"tool"|"action";
 id?:string;
 phase:CookingPhase;
 en:string;
 th:string;
 verb:string;
 verbTh:string;
 taps:number;
};
const IN=(id:string,phase:CookingPhase="cook"):CookingStep=>{
 const v=vocabulary[id];
 return {type:"ingredient",id,phase,en:`Choose ${v.en.toLowerCase()}.`,th:`เลือก${v.th}`,verb:"Choose",verbTh:"เลือก",taps:1};
};
const EQ=(id:string,phase:CookingPhase="prep"):CookingStep=>{
 const v=vocabulary[id];
 return {type:"tool",id,phase,en:`Pick up the ${v.en.toLowerCase()}.`,th:`หยิบ${v.th}`,verb:"Use",verbTh:"หยิบใช้",taps:1};
};
const DO=(verb:string,verbTh:string,en:string,th:string,phase:CookingPhase,taps=2):CookingStep=>
 ({type:"action",phase,en,th,verb,verbTh,taps});

const plans:Record<string,CookingStep[]>={
 "pad-thai":[
  EQ("bowl"),IN("tamarind","prep"),IN("fishsauce","prep"),
  DO("Mix","ผสม","Mix the tamarind paste and fish sauce in the bowl.","ผสมน้ำมะขามเปียกและน้ำปลาในชาม","prep",2),
  EQ("strainer"),IN("noodles","prep"),
  DO("Drain","สะเด็ดน้ำ","Soak the rice noodles until soft, then drain them with the strainer.","แช่เส้นให้นิ่มแล้วใช้กระชอนสะเด็ดน้ำ","prep",2),
  EQ("wok","cook"),EQ("spatula","cook"),IN("shrimp"),
  DO("Stir-fry","ผัด","Stir-fry the shrimp in the wok until cooked.","ผัดกุ้งในกระทะก้นลึกจนสุก","cook",3),
  IN("egg"),
  DO("Scramble","ยีไข่","Scramble the egg with the spatula.","ใช้ตะหลิวยีไข่ให้สุก","cook",2),
  DO("Toss","คลุก","Add the drained noodles and prepared sauce. Toss with the spatula.","ผัดเส้นกับซอสที่เตรียมไว้โดยใช้ตะหลิว","cook",3),
  IN("sprouts","plate"),IN("lime","plate"),
  DO("Serve","เสิร์ฟ","Serve the pad thai with fresh bean sprouts and lime.","เสิร์ฟผัดไทยพร้อมถั่วงอกและมะนาว","plate")
 ],
 "tom-yum":[
  EQ("board"),EQ("knife"),IN("lemongrass","prep"),IN("galangal","prep"),
  DO("Slice","หั่น","Slice the lemongrass and galangal on the cutting board with the knife.","ใช้มีดหั่นตะไคร้และข่าบนเขียง","prep",3),
  IN("kaffir","prep"),IN("mushroom","prep"),
  DO("Cut","หั่น","Cut the mushrooms into bite-sized pieces with the knife.","ใช้มีดหั่นเห็ดเป็นชิ้นพอดีคำ","prep",3),
  EQ("pot","cook"),
  DO("Boil","ต้ม","Bring water to a gentle boil in the pot, then add the aromatics.","ต้มน้ำในหม้อให้เดือดเบา ๆ แล้วใส่สมุนไพร","cook",2),
  IN("shrimp"),
  DO("Simmer","เคี่ยว","Simmer the shrimp and mushrooms until cooked.","ต้มกุ้งและเห็ดจนสุก","cook",3),
  IN("fishsauce","plate"),IN("lime","plate"),
  EQ("ladle","plate"),
  DO("Ladle","ตักเสิร์ฟ","Season with fish sauce and lime, then ladle the soup into a bowl.","ปรุงด้วยน้ำปลาและมะนาว แล้วใช้กระบวยตักเสิร์ฟ","plate",2)
 ],
 "bibimbap":[
  EQ("board"),EQ("knife"),IN("carrot","prep"),
  DO("Slice","หั่น","Use the knife to cut the carrot into thin strips.","ใช้มีดหั่นแครอตเป็นเส้นบาง ๆ","prep",3),
  IN("spinach","prep"),
  EQ("pan","cook"),EQ("spoon","cook"),IN("beef"),
  DO("Sauté","ผัด","Sauté the beef, carrot and spinach in the frying pan.","ผัดเนื้อ แครอต และผักปวยเล้งในกระทะ","cook",3),
  IN("egg"),
  DO("Fry","ทอด","Fry the egg gently in the pan.","ทอดไข่ในกระทะ","cook",2),
  EQ("stonebowl","plate"),IN("rice","plate"),
  DO("Arrange","จัดวาง","Place warm rice in the stone bowl and arrange the toppings.","ใส่ข้าวอุ่น ๆ ลงในชามหินและจัดเครื่องเคียง","plate",2),
  IN("gochujang","plate"),
  DO("Mix","คลุก","Add gochujang and use the spoon to mix the bibimbap.","ใส่โคชูจังแล้วใช้ช้อนคลุกบิบิมบับ","plate",3)
 ],
 "kimchi-jjigae":[
  EQ("board"),EQ("knife"),IN("tofu","prep"),IN("mushroom","prep"),
  DO("Dice","หั่นเต๋า","Dice the tofu and slice the mushrooms on the cutting board.","ใช้มีดหั่นเต้าหู้เป็นลูกเต๋าและหั่นเห็ดบนเขียง","prep",3),
  IN("scallion","prep"),
  DO("Chop","ซอย","Chop the green onion with the knife.","ซอยต้นหอมด้วยมีด","prep",3),
  EQ("pot","cook"),IN("pork"),IN("kimchi"),
  DO("Sauté","ผัด","Sauté the pork and kimchi in the pot.","ผัดหมูกับกิมจิในหม้อ","cook",3),
  IN("broth"),
  DO("Simmer","เคี่ยว","Pour in the broth, then simmer with the tofu and mushrooms.","เติมน้ำซุปแล้วเคี่ยวพร้อมเต้าหู้และเห็ด","cook",3),
  EQ("ladle","plate"),
  DO("Serve","ตักเสิร์ฟ","Use the ladle to serve the stew and sprinkle green onion on top.","ใช้กระบวยตักซุปใส่ชามและโรยต้นหอม","plate",2)
 ],
 "tempura":[
  EQ("bowl"),IN("flour","prep"),IN("water","prep"),
  EQ("whisk"),
  DO("Whisk","ตีแป้ง","Whisk cold water and flour in the bowl to make a light batter.","ใช้ตะกร้อมือตีแป้งกับน้ำเย็นในชามให้เป็นแป้งชุบทอด","prep",3),
  IN("shrimp","prep"),EQ("board"),EQ("knife"),IN("sweetpotato","prep"),
  DO("Slice","หั่น","Slice the sweet potato on the cutting board with the knife.","ใช้มีดหั่นมันเทศเป็นแว่นบนเขียง","prep",3),
  DO("Dip","ชุบ","Dip the shrimp and sliced sweet potato in the batter.","ชุบกุ้งและมันเทศที่หั่นแล้วลงในแป้งทอด","prep",2),
  EQ("pot","cook"),IN("oil"),
  DO("Heat","ตั้งไฟ","Heat the cooking oil in the pot.","ตั้งหม้อใส่น้ำมันให้ร้อน","cook",2),
  DO("Fry","ทอด","Carefully fry the coated shrimp and sweet potato until golden.","ทอดกุ้งและมันเทศที่ชุบแป้งจนเหลืองกรอบ","cook",3),
  EQ("skimmer","plate"),
  DO("Drain","ตักสะเด็ดน้ำมัน","Use the skimmer to lift the tempura and drain the oil.","ใช้กระชอนตักของทอดช้อนเทมปุระขึ้นสะเด็ดน้ำมัน","plate",2),
  IN("ginger","plate"),
  DO("Serve","เสิร์ฟ","Serve the crispy tempura with grated ginger on the side.","เสิร์ฟเทมปุระกรอบกับขิงขูด","plate")
 ],
 "miso-soup":[
  EQ("pot","cook"),IN("dashi"),
  DO("Warm","อุ่น","Warm the dashi in the pot without boiling hard.","อุ่นน้ำซุปดาชิในหม้อโดยไม่ต้มแรง","cook",2),
  EQ("spoon","cook"),IN("miso"),
  DO("Dissolve","ละลาย","Lower the heat and stir the miso paste gently with the spoon.","ลดไฟแล้วใช้ช้อนคนมิโสะให้ละลาย","cook",3),
  IN("tofu"),IN("wakame"),
  DO("Warm","อุ่น","Gently warm the tofu and wakame. Do not boil the miso.","อุ่นเต้าหู้และสาหร่ายอย่างเบามือ อย่าต้มมิโสะให้เดือด","cook",2),
  EQ("ladle","plate"),EQ("bowl","plate"),IN("scallion","plate"),
  DO("Serve","ตักเสิร์ฟ","Use the ladle to pour the soup into the bowl and top with green onion.","ใช้กระบวยตักซุปใส่ชามแล้วโรยต้นหอม","plate",2)
 ],
 "spaghetti":[
  EQ("pot","cook"),IN("pasta"),
  DO("Boil","ต้ม","Boil the pasta in the pot until al dente.","ต้มเส้นพาสต้าในหม้อจนสุกกำลังดี","cook",3),
  EQ("strainer","cook"),
  DO("Drain","สะเด็ดน้ำ","Drain the pasta using the mesh strainer.","ใช้กระชอนกรองเส้นพาสต้าให้สะเด็ดน้ำ","cook",2),
  EQ("pan","cook"),EQ("spoon","cook"),IN("oil"),IN("garlic"),
  DO("Sauté","ผัด","Sauté the garlic in cooking oil in the frying pan.","ผัดกระเทียมกับน้ำมันในกระทะ","cook",3),
  IN("tomato"),
  DO("Simmer","เคี่ยว","Simmer the tomatoes in the pan until they become a sauce.","เคี่ยวมะเขือเทศในกระทะจนกลายเป็นซอส","cook",2),
  DO("Toss","คลุก","Use the spoon to toss the cooked pasta with the tomato sauce.","ใช้ช้อนคลุกพาสต้าสุกกับซอสมะเขือเทศ","cook",3),
  IN("basil","plate"),IN("parmesan","plate"),
  DO("Serve","เสิร์ฟ","Top with basil and Parmesan, then serve.","โรยใบโหระพาและพาร์เมซานก่อนเสิร์ฟ","plate")
 ],
 "margherita":[
  EQ("pot","cook"),IN("pasta"),
  DO("Boil","ต้ม","Boil the spaghetti until al dente.","ต้มสปาเกตตีจนสุกกำลังดี","cook",3),
  EQ("strainer","cook"),
  DO("Drain","สะเด็ดน้ำ","Drain the cooked spaghetti with the mesh strainer.","ใช้กระชอนกรองเส้นสปาเกตตี","cook",2),
  EQ("pan","cook"),EQ("spoon","cook"),IN("oil"),IN("garlic"),
  DO("Sauté","ผัด","Sauté the garlic in cooking oil in the pan.","ผัดกระเทียมกับน้ำมันในกระทะ","cook",3),
  IN("tomato"),IN("sauce"),
  DO("Simmer","เคี่ยว","Simmer the tomatoes and tomato sauce in the pan.","เคี่ยวมะเขือเทศกับซอสมะเขือเทศในกระทะ","cook",2),
  DO("Toss","คลุก","Toss the spaghetti with sauce using the spoon.","ใช้ช้อนคลุกเส้นสปาเกตตีกับซอส","cook",3),
  IN("mozzarella","plate"),IN("basil","plate"),
  DO("Serve","เสิร์ฟ","Finish with mozzarella and fresh basil, then serve.","ใส่มอสซาเรลลาและใบโหระพาสดก่อนเสิร์ฟ","plate")
 ]
};

export const getCookingSteps=(dish:EnglishMenuDish):CookingStep[]=>plans[dish.id]??[];

/** Development guard: new recipes must not silently omit any listed ingredients or tools. */
export const validateCookingPlans=()=>dishes.map(dish=>{
 const steps=getCookingSteps(dish);
 const usedIngredients=new Set(steps.filter(s=>s.type==="ingredient").map(s=>s.id));
 const usedTools=new Set(steps.filter(s=>s.type==="tool").map(s=>s.id));
 const missingIngredients=dish.ingredients.filter(id=>!usedIngredients.has(id));
 const missingTools=dish.tools.filter(id=>!usedTools.has(id));
 const unknown=steps.filter(s=>s.id&&!vocabulary[s.id]).map(s=>s.id);
 return {dish:dish.id,steps:steps.length,missingIngredients,missingTools,unknown};
});
