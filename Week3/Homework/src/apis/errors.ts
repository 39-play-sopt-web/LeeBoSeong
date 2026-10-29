import axios from 'axios';
import { ApiConfigurationError } from './client';

export function isRequestCanceled(error: unknown): boolean {
  return axios.isCancel(error);
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiConfigurationError) {
    return '영화 서비스 연결을 준비하고 있어요. 잠시 후 다시 시도해 주세요.';
  }

  if (axios.isAxiosError<unknown>(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return '응답이 늦어지고 있어요. 잠시 후 다시 시도해 주세요.';
    }

    switch (error.response?.status) {
      case 401:
        return '영화 서비스 인증에 실패했어요. API 키를 확인해 주세요.';
      case 404:
        return '요청한 영화를 찾을 수 없어요.';
      case 429:
        return '요청이 많아요. 잠시 후 다시 시도해 주세요.';
    }

    if (!error.response) {
      return '영화 정보를 불러올 수 없어요. 네트워크 연결을 확인해 주세요.';
    }
  }

  return '영화 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
}
