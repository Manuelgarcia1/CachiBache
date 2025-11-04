import React, { useState } from "react";
import { Formik } from "formik";
import { Input, YStack, Text } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { resetPasswordSchema } from "@sharedvalidation/schemas";
import { ResetPasswordButton } from "./ResetPasswordButton";

interface ResetPasswordFormProps {
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  loading?: boolean;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Formik
      initialValues={{ newPassword: "", confirmPassword: "" }}
      validationSchema={resetPasswordSchema}
      onSubmit={(values) => {
        onSubmit(values.newPassword, values.confirmPassword);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
      }) => (
        <YStack width="100%" space="$5" paddingHorizontal="$4">
          <Text
            color="#ffffff"
            fontSize="$8"
            fontWeight="bold"
            textAlign="center"
            marginBottom="$2"
          >
            Restablecer Contraseña
          </Text>

          <Text color="#ffffff" fontSize="$5" textAlign="center" marginBottom="$3">
            Ingresa tu nueva contraseña
          </Text>

          {/* Nueva Contraseña */}
          <YStack space="$3">
            <YStack position="relative">
              <Input
                placeholder="Nueva contraseña"
                placeholderTextColor="#999"
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                width="100%"
                height={55}
                backgroundColor="$white"
                borderRadius="$6"
                paddingHorizontal="$5"
                paddingRight={50}
                fontSize="$4"
              />
              <YStack
                position="absolute"
                right={15}
                top={0}
                height="100%"
                justifyContent="center"
                onPress={() => setShowPassword(!showPassword)}
                pressStyle={{ opacity: 0.7 }}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#666"
                />
              </YStack>
            </YStack>
            {touched.newPassword && errors.newPassword && (
              <Text color="#ff6b6b" fontSize="$3" marginTop="$1">
                {errors.newPassword}
              </Text>
            )}
          </YStack>

          {/* Confirmar Contraseña */}
          <YStack space="$3">
            <YStack position="relative">
              <Input
                placeholder="Confirmar contraseña"
                placeholderTextColor="#999"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                width="100%"
                height={55}
                backgroundColor="$white"
                borderRadius="$6"
                paddingHorizontal="$5"
                paddingRight={50}
                fontSize="$4"
              />
              <YStack
                position="absolute"
                right={15}
                top={0}
                height="100%"
                justifyContent="center"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                pressStyle={{ opacity: 0.7 }}
              >
                <Feather
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#666"
                />
              </YStack>
            </YStack>
            {touched.confirmPassword && errors.confirmPassword && (
              <Text color="#ff6b6b" fontSize="$3" marginTop="$1">
                {errors.confirmPassword}
              </Text>
            )}
          </YStack>

          <ResetPasswordButton
            onPress={handleSubmit}
            disabled={!isValid || loading}
            loading={loading}
          />
        </YStack>
      )}
    </Formik>
  );
};
