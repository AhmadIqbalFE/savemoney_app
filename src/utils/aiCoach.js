export function generateAiMessage({
  income,
  expense,
  goals,
  reminders,
}) {

  if (expense > income) {
    return {
      type: "warning",
      message:
        "Pengeluaran lebih besar dari pemasukan bulan ini",
    };
  }

  const activeGoal = goals.find(
    (goal) =>
      goal.current / goal.target >= 0.8
  );

  if (activeGoal) {
    return {
      type: "success",
      message:
        `${activeGoal.name} hampir tercapai 🔥`,
    };
  }

  const urgentReminder = reminders.find(
    (item) => item.daysLeft <= 1
  );

  if (urgentReminder) {
    return {
      type: "alert",
      message:
        `${urgentReminder.name} jatuh tempo besok`,
    };
  }

  return {
    type: "normal",
    message:
      "Keuangan kamu cukup stabil minggu ini",
  };
}