import { Avatar, Text, YStack } from 'tamagui';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar: string;
}

export function ProfileHeader({ name, email, avatar }: ProfileHeaderProps) {
  return (
    <YStack alignItems="center" backgroundColor="#094b7e" paddingTop={60} paddingBottom="$6">
        <Avatar circular size="$12">
        {/* Solo mostrar imagen si avatar tiene valor */}
        {avatar && <Avatar.Image src={avatar} />}
        <Avatar.Fallback
          backgroundColor="#64748b"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            color="#fff"
            fontSize={48}
            fontWeight="bold"
            textAlign="center"
          >
            {name[0]?.toUpperCase() || 'U'}
          </Text>
        </Avatar.Fallback>
      </Avatar>
      <Text fontSize={28} fontWeight="700" color="#fff" marginTop="$4">
        {name}
      </Text>
      <Text fontSize={24} color="#cbd5e1" marginTop="$2">
        {email}
      </Text>
    </YStack>
  );
}
