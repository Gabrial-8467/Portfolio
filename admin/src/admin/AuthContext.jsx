import { useState, useCallback, useEffect } from 'react';
import { api, getToken, setToken } from '../api/client';
import { AuthContext } from './useAuth';

const ACTIVE_KEY = 'portfolio_active_id';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [activePortfolioId, setActivePortfolioId] = useState(() => localStorage.getItem(ACTIVE_KEY));
  const [token, setTokenState] = useState(() => getToken());
  const [isLoading, setIsLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api.auth
      .me()
      .then((me) => {
        if (cancelled) return;
        setUser(me.user);
        setPortfolios(me.portfolios || []);
        const hasActive = (me.portfolios || []).some((p) => String(p._id) === activePortfolioId);
        if (!hasActive && me.portfolios?.length) {
          setActivePortfolioId(String(me.portfolios[0]._id));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setToken(null);
          setTokenState(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const applyAuthResult = useCallback((result) => {
    setToken(result.token);
    setTokenState(result.token);
    setUser(result.user);
    const list = result.portfolios || [];
    setPortfolios(list);
    if (list.length) setActivePortfolioId(String(list[0]._id));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const result = await api.auth.login(email, password);
      applyAuthResult(result);
      return result.user;
    },
    [applyAuthResult]
  );

  const register = useCallback(
    async (data) => {
      const result = await api.auth.register(data);
      applyAuthResult(result);
      return result;
    },
    [applyAuthResult]
  );

  const selectPortfolio = useCallback((id) => {
    setActivePortfolioId(String(id));
    localStorage.setItem(ACTIVE_KEY, String(id));
  }, []);

  const refreshPortfolios = useCallback(async () => {
    try {
      const list = await api.portfolios.list();
      setPortfolios(list || []);
      return list || [];
    } catch {
      return [];
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setUser(null);
    setPortfolios([]);
    setActivePortfolioId(null);
    localStorage.removeItem(ACTIVE_KEY);
  }, []);

  const activePortfolio = portfolios.find((p) => String(p._id) === activePortfolioId) || portfolios[0] || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        portfolios,
        activePortfolio,
        activePortfolioId: activePortfolio?._id,
        isLoading,
        login,
        register,
        logout,
        selectPortfolio,
        refreshPortfolios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}