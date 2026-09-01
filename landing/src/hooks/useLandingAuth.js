import { useState, useEffect, useCallback } from 'react';
import { api, getStoredToken, setStoredToken, AUTH_CHANNEL } from '../api/client';

export function useLandingAuth() {
  const [token, setTokenState] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    api.getMe(token)
      .then((data) => {
        if (!isMounted) return;
        if (data?.user) {
          setUser(data.user);
          setPortfolios(data.portfolios || []);
        } else {
          setUser(null);
          setPortfolios([]);
          setStoredToken(null);
          setTokenState(null);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(null);
        setPortfolios([]);
        setStoredToken(null);
        setTokenState(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'portfolio_admin_token') {
        const nextToken = e.newValue;
        setTokenState(nextToken);
        if (!nextToken) {
          setUser(null);
          setPortfolios([]);
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    let bc = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel(AUTH_CHANNEL);
        bc.onmessage = (event) => {
          if (event.data?.type === 'AUTH_CHANGE') {
            const next = event.data.token || getStoredToken();
            setTokenState(next);
            if (!next) {
              setUser(null);
              setPortfolios([]);
            }
          }
        };
      } catch {
        /* ignore */
      }
    }

    const handleFocus = () => {
      const current = getStoredToken();
      if (current !== token) {
        setTokenState(current);
        if (!current) {
          setUser(null);
          setPortfolios([]);
        }
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      if (bc) bc.close();
    };
  }, [token]);

  const logout = useCallback(() => {
    setStoredToken(null);
    setTokenState(null);
    setUser(null);
    setPortfolios([]);
  }, []);

  return {
    token,
    user,
    portfolios,
    isAuthenticated: Boolean(token && user),
    loading,
    logout,
  };
}
