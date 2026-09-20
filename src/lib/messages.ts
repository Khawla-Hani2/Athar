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
  deleteEventTitle: 'هل أنتِ متأكدة من حذف هذا الحدث من Google Calendar؟',
  deleteEventBody: (title: string) => `"${title}" — لا يمكن التراجع عن هذا الإجراء.`,
  disconnectGoogleTitle: 'هل تريدين قطع الربط مع Google Calendar؟',
  disconnectGoogleBody: 'لن تظهر أحداث تقويم Google بعد الآن حتى تُعيدي الربط.',
} as const

export const googleCalendarMessages = {
  connected: 'تم ربط تقويم Google بنجاح ',
  disconnected: 'تم قطع الربط مع Google Calendar',
  eventCreated: 'تمت إضافة الحدث إلى Google Calendar ',
  eventUpdated: 'تم حفظ التغييرات على الحدث ',
  eventDeleted: 'تم حذف الحدث من Google Calendar',
  needsReconnect: 'انتهت صلاحية الاتصال بـ Google Calendar، أعيدي الربط لمتابعة الاستخدام.',
  notConnectedTitle: 'اربطي تقويم Google',
  notConnectedBody: 'اعرضي أحداث Google Calendar وأنشئي أحداثًا جديدة مباشرة من أَثَر.',
} as const

export const authMessages = {
  passwordTooShort: 'كلمة المرور يجب أن تتكون من ٨ أحرف على الأقل.',
  passwordMismatch: 'كلمتا المرور غير متطابقتين.',
  firebaseNotConfigured: 'لم يتم إعداد Firebase بعد. أضيفي بيانات المشروع في ملف .env',
  firebaseNotConfiguredHint:
    'لم يتم إعداد Firebase بعد. أنشئي مشروعًا في Firebase Console وأضيفي بياناته إلى ملف .env',
  passwordUpdated: 'تم تحديث كلمة المرور ',
} as const
