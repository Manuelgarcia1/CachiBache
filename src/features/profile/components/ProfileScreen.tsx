import { Text, YStack } from 'tamagui';
import { ProfileDashboard } from './ProfileDashboard';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';

interface User {
	name: string;
	email: string;
	avatar: string;
	phone?: string;
}

interface ProfileScreenProps {
	user: User;
	reportStats: {
		pendiente: number;
		reparacion: number;
		finalizado: number;
	};
	dashboard: {
		tiempoPromedioPendiente: number;
		tiempoPromedioReparacion: number;
		bachesMes: number[];
		meses: string[];
	};
}

export function ProfileScreen({ user, reportStats, dashboard }: ProfileScreenProps) {
			return (
				<YStack flex={1} backgroundColor="#f8fafc">
					<ProfileHeader name={user.name} email={user.email} avatar={user.avatar} />
					<YStack paddingHorizontal="$3" paddingVertical="$3" gap="$3" paddingBottom={0}>
					<Text fontSize={30} fontWeight="700" color="#000">
						Historial de reportes
					</Text>
					<ProfileStats {...reportStats} />
					<Text fontSize={30} fontWeight="700" color="#000">
						Dashboard
					</Text>
					<ProfileDashboard {...dashboard} />
				</YStack>
			</YStack>
		);
}
