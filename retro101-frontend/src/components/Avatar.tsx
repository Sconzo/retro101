import { getInitials, getAvatarColor } from '../utils/avatarUtils';

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 32 }: AvatarProps) {
  const initials = getInitials(name);
  const backgroundColor = getAvatarColor(name);

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-semibold"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        fontSize: `${size * 0.4}px`,
      }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}
