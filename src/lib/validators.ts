import { isReservedSlug } from "@/lib/reserved-slugs";

export function validateEmail(value: string): string | null {
  if (!value) return "이메일을 입력해주세요";
  if (value.length > 254) return "이메일은 254자 이하로 입력해주세요";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "올바른 이메일 형식이 아닙니다";
  return null;
}

export function validateNickname(value: string): string | null {
  if (!value) return "닉네임을 입력해주세요";
  if (value.length < 2) return "닉네임은 2자 이상이어야 합니다";
  if (value.length > 20) return "닉네임은 20자 이하로 입력해주세요";
  if (!/^[가-힣a-zA-Z0-9]+$/.test(value))
    return "한글, 영문, 숫자만 사용할 수 있습니다";
  if (isReservedSlug(value)) return "사용할 수 없는 이름입니다";
  return null;
}

export function validateSlug(value: string): string | null {
  if (!value) return null; // optional until submit
  if (value.length < 3) return "3자 이상이어야 합니다";
  if (value.length > 30) return "30자 이하로 입력해주세요";
  if (/^[-_]|[-_]$/.test(value)) return "하이픈·언더바로 시작하거나 끝날 수 없습니다";
  if (/[-_]{2,}/.test(value)) return "하이픈·언더바를 연속으로 사용할 수 없습니다";
  if (!/^[a-zA-Z0-9_-]+$/.test(value))
    return "영문, 숫자, 하이픈(-), 언더바(_)만 사용할 수 있습니다";
  if (/\//.test(value)) return "슬래시(/)는 사용할 수 없습니다";
  if (isReservedSlug(value)) return "사용할 수 없는 주소입니다";
  return null;
}

export function validateUrl(value: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    if (!["http:", "https:"].includes(url.protocol)) return "http 또는 https 주소만 가능합니다";
    return null;
  } catch {
    return "올바른 URL 형식이 아닙니다";
  }
}

export function normalizeUrl(value: string): string {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function validatePassword(value: string): string | null {
  if (!value) return "비밀번호를 입력해주세요";
  if (/\s/.test(value)) return "공백은 사용할 수 없습니다";
  if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다";
  if (value.length > 20) return "비밀번호는 20자 이하로 입력해주세요";
  if (!/[a-zA-Z]/.test(value)) return "영문을 포함해야 합니다";
  if (!/[0-9]/.test(value)) return "숫자를 포함해야 합니다";
  if (!/[!@#$%^&*()_=+.]/.test(value)) return "특수문자(!@#$%^&*()_=+.)를 포함해야 합니다";
  return null;
}

export function validatePasswordConfirm(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return "비밀번호를 다시 입력해주세요";
  if (password !== confirm) return "비밀번호가 일치하지 않습니다";
  return null;
}
