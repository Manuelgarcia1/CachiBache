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
        <Avatar.Image src={avatar} />
        <Avatar.Fallback backgroundColor="#64748b">
          <Text color="#fff">{name[0]}</Text>
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
