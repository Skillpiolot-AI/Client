const booking = {
  status: 'confirmed',
  scheduledAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
  duration: 60
};

const isExpiredSessionOld = (booking) => ['pending', 'confirmed'].includes(booking.status) && new Date(booking.scheduledAt) < new Date();

const isExpiredSessionNew = (booking) => {
    if (!['pending', 'confirmed'].includes(booking.status)) return false;
    const sessionEndTime = new Date(new Date(booking.scheduledAt).getTime() + (booking.duration || 60) * 60000);
    return sessionEndTime < new Date();
};

console.log("Old logic:", isExpiredSessionOld(booking)); // Expected: true (BUG)
console.log("New logic:", isExpiredSessionNew(booking)); // Expected: false (CORRECT)
