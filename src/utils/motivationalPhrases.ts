const PHRASES: string[] = [
  'كل خطوة صغيرة اليوم، أثر كبير غدًا.',
  '"من جدّ وجد، ومن زرع حصد."',
  'اليوم فرصة جديدة لتتركي أثرك.',
  '"العلم في الصغر كالنقش على الحجر."',
  'إنجازك اليوم هو أساس غدك.',
  'ما تنجزينه اليوم يبني من تصبحين عليه غدًا.',
  '"إذا هبت رياحك فاغتنمها."',
  'التركيز على المهم يصنع الفرق دائمًا.',
  'رتّبي أولوياتك، والباقي يتبع.',
  'أثرك يبدأ بخطوة واحدة اليوم.',
  '"خير الأعمال أدومها وإن قلّ."',
  'كوني لطيفة مع نفسك، وواصلي التقدم.',
  'الاستمرارية أهم من الكمال.',
  '"لا تؤجل عمل اليوم إلى الغد."',
  'إنجاز صغير اليوم أفضل من خطة كبيرة مؤجلة.',
  'أنتِ أقرب لهدفك مما تظنين.',
  'الوضوح يبدأ حين تكتبين ما عليك فعله.',
  'يوم منظم يمنحك راحة بال حقيقية.',
  '"من سار على الدرب وصل."',
  'ثقي بخطواتك، فهي تتراكم لتصنع أثرًا.',
]

/** Deterministic per-day selection so the phrase stays the same all day and changes daily. */
export function getDailyMotivationalPhrase(date: Date = new Date()): string {
  const dayOfYear = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      86400000
  )
  const index = (dayOfYear + date.getFullYear()) % PHRASES.length
  return PHRASES[index]
}
