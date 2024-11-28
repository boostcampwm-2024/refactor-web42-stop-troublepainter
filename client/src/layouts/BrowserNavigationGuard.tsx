import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigationModalStore } from '@/stores/navigationModal.store';

const BrowserNavigationGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions: modalActions } = useNavigationModalStore();

  useEffect(() => {
    // 새로고침, beforeunload 이벤트 핸들러
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 브라우저 기본 경고 메시지 표시
      e.preventDefault();
      e.returnValue = ''; // 레거시 브라우저 지원

      // 새로고침 시 메인으로 이동하도록 세션스토리지에 플래그 저장
      sessionStorage.setItem('shouldRedirect', 'true');

      // 사용자 정의 메시지 반환 (일부 브라우저에서는 무시될 수 있음)
      return '게임을 종료하시겠습니까? 현재 진행 상태가 저장되지 않을 수 있습니다.';
    };

    // popstate 이벤트 핸들러 (브라우저 뒤로가기/앞으로가기)
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault(); // 기본 동작 중단
      modalActions.openModal();

      // 취소 시 현재 URL 유지를 위해 history stack에 다시 추가하도록 조작
      window.history.pushState(null, '', location.pathname);
    };

    // 초기 진입 시 history stack에 현재 상태 추가
    window.history.pushState(null, '', location.pathname);

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // 새로고침 후 리다이렉트 체크
    const shouldRedirect = sessionStorage.getItem('shouldRedirect');
    if (shouldRedirect === 'true' && location.pathname !== '/') {
      navigate('/', { replace: true });
      sessionStorage.removeItem('shouldRedirect');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.pathname]);

  return null;
};

export default BrowserNavigationGuard;
