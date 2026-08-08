export const generateGuestId = (): string => {
  const prefix = 'gst_';
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}${id}`;
};

export default generateGuestId;
