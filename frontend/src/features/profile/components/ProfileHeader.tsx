import { Avatar, Text, YStack, styled } from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar: string;
}

const GradientBackground = styled(LinearGradient, {
  width: '100%',
  alignItems: 'center',
  paddingTop: 60,
  paddingBottom: 32,
});

export function ProfileHeader({ name, email, avatar }: ProfileHeaderProps) {
  return (
    <GradientBackground
      colors={['#0c4a6e', '#075985', '#0369a1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Avatar con sombra mejorada */}
      <YStack
        shadowColor="#000"
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={8}
        elevation={8}
      >
        <Avatar circular size="$12" borderWidth={4} borderColor="rgba(255,255,255,0.2)">
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
      </YStack>

      {/* Nombre con mejor espaciado */}
      <Text
        fontSize={26}
        fontWeight="700"
        color="#fff"
        marginTop="$5"
        letterSpacing={0.5}
      >
        {name}
      </Text>

      {/* Email con mejor contraste */}
      <Text
        fontSize={16}
        color="rgba(255,255,255,0.85)"
        marginTop="$2"
        letterSpacing={0.3}
      >
        {email}
      </Text>
    </GradientBackground>
  );
}
