import apiClient from './apiClient';

export const PARTS = ['WEB', 'iOS', 'ANDROID'] as const;
export type Part = (typeof PARTS)[number];

type AuthorizationCodeResponse = {
  isSuccess: boolean;
  data: { authorizationCode: string } | null;
};

export async function issueAuthorizationCode(part: Part) {
  const { data: response } = await apiClient.post<AuthorizationCodeResponse>(
    '/members/authorization-code',
    { part },
  );

  const authorizationCode = response.data?.authorizationCode;
  if (!response.isSuccess || !authorizationCode?.trim()) {
    throw new Error('회원 코드를 발급받지 못했습니다.');
  }

  return authorizationCode;
}
