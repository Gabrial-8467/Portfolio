import { useState, useCallback, useEffect } from 'react';
import { api, getToken, setToken, getApiKey, setApiKey, ADMIN_API_KEY } from '../api/client';
import { AuthContext } from './useAuth';

const ACTIVE_KEY = 'portfolio_active_id';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [activePortfolioId, setActivePortfolioId] = useState(() => localStorage.getItem(ACTIVE_KEY));
  const [token, setTokenState] = useState(() => getToken());
  const [isLoading, setIsLoading] = useState(Boolean(getToken()));
  const [activePortfolio, setActivePortfolio] = useState(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api.auth
      .me()
      .then((me) => {
        if (cancelled) return;
        setUser(me.user);
        setPortfolios(me.portfolios || []);

        if (getApiKey() || ADMIN_API_KEY) {
          return api.portfolios.get().then((data) => {
            if (cancelled) return;
            setActivePortfolio(data);
            if (data?._id) {
              setActivePortfolioId(String(data._id));
              localStorage.setItem(ACTIVE_KEY, String(data._id));
            }
          }).catch(() => {
            const hasActive = (me.portfolios || []).some((p) => String(p._id) === activePortfolioId);
            if (!hasActive && me.portfolios?.length) {
              const nextId = String(me.portfolios[0]._id);
              setActivePortfolioId(nextId);
              localStorage.setItem(ACTIVE_KEY, nextId);
              setActivePortfolio(me.portfolios[0]);
            }
          });
        } else {
          const hasActive = (me.portfolios || []).some((p) => String(p._id) === activePortfolioId);
          if (!hasActive && me.portfolios?.length) {
            const nextId = String(me.portfolios[0]._id);
            setActivePortfolioId(nextId);
            localStorage.setItem(ACTIVE_KEY, nextId);
          }
          setActivePortfolio(
            (me.portfolios || []).find((p) => String(p._id) === (activePortfolioId || me.portfolios[0]?._id)) ||
            me.portfolios?.[0] ||
            null
          );
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
    if (result.apiKey) setApiKey(result.apiKey);
    setUser(result.user);
    const list = result.portfolios || [];
    setPortfolios(list);
    const savedId = localStorage.getItem(ACTIVE_KEY);
    const stillExists = savedId && list.some((p) => String(p._id) === savedId);
    const nextId = stillExists ? savedId : list.length ? String(list[0]._id) : null;
    setActivePortfolioId(nextId);
    if (nextId) localStorage.setItem(ACTIVE_KEY, nextId);
    else localStorage.removeItem(ACTIVE_KEY);
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
    const found = portfolios.find((p) => String(p._id) === String(id));
    if (found) setActivePortfolio(found);
  }, [portfolios]);

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
    setActivePortfolio(null);
    localStorage.removeItem(ACTIVE_KEY);
  }, []);

  const loginWithToken = useCallback((newToken) => {
    setToken(newToken);
    setTokenState(newToken);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUserData } : updatedUserData));
  }, []);

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
        loginWithToken,
        updateUser,
        logout,
        selectPortfolio,
        refreshPortfolios,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
