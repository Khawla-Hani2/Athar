/**
 * Central place for user-facing Arabic strings that were previously duplicated
 * across pages. Keeping them here makes wording consistent and easy to adjust.
 */

export const taskMessages = {
  completed: 'أحسنتِ! تم إنجاز المهمة ',
  created: 'تمت إضافة المهمة ',
  saved: 'تم حفظ التغييرات ',
  deleted: 'تم حذف المهمة',
  updateFailed: 'تعذّر تحديث المهمة، حاولي مرة أخرى.',
  deleteFailed: 'تعذّر حذف المهمة.',
} as const

export const noteMessages = {
  created: 'تمت إضافة الملاحظة ',
  saved: 'تم حفظ الملاحظة ',
  deleted: 'تم حذف الملاحظة',
} as const

export const confirmMessages = {
  deleteTaskTitle: 'هل أنتِ متأكدة من حذف هذه المهمة؟',
  deleteTaskBody: (title: string) => `"${title}" — لا يمكن التراجع عن هذا الإجراء.`,
  deleteNoteTitle: 'هل أنتِ متأكدة من حذف هذه الملاحظة؟',
  deleteNoteBody: 'لا يمكن التراجع عن هذا الإجراء.',
} as const

export const authMessages = {
  passwordTooShort: 'كلمة المرور يجب أن تتكون من ٨ أحرف على الأقل.',
  passwordMismatch: 'كلمتا المرور غير متطابقتين.',
  firebaseNotConfigured: 'لم يتم إعداد Firebase بعد. أضيفي بيانات المشروع في ملف .env',
  firebaseNotConfiguredHint:
    'لم يتم إعداد Firebase بعد. أنشئي مشروعًا في Firebase Console وأضيفي بياناته إلى ملف .env',
  passwordUpdated: 'تم تحديث كلمة المرور ',
} as const
