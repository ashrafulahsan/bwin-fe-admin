import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/usersService";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "@/constants/constants";

/**
 * Hook for fetching paginated users
 * @param {Object} params - Query parameters {page, limit, search, role, status}
 * @param {boolean} enabled - Enable/disable the query
 * @returns {Query result with data, loading, error}
 */
export const useUsers = (params = {}, enabled = true) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersService.getUsers(params),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching single user by ID
 * @param {number|string} userId - User ID
 * @param {boolean} enabled - Enable/disable the query
 * @returns {Query result with user data}
 */
export const useUser = (userId, enabled = true) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersService.getUserById(userId),
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating a new user
 * @returns {Mutation with mutate, loading, error}
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => usersService.createUser(data),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook for updating user
 * @returns {Mutation}
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }) => usersService.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook for deleting user
 * @returns {Mutation}
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => usersService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook for login
 * @returns {Mutation with mutate, loading, error}
 */
export const useLogin = () => {
  const { setAccessToken, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      // Store tokens
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
        if (data.refresh_token) {
          window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, data.refresh_token);
        }
      }

      // Update auth store
      setAccessToken(data.access_token);
      if (data.user) {
        setUser(data.user);
      }

      // Invalidate all queries to refetch with new token
      queryClient.clear();
    },
  });
};

/**
 * Hook for logout
 * @returns {Mutation}
 */
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    // Clear local auth state on settle (not just success) — the backend call
    // can fail (expired token, network down) and the user must still be
    // logged out locally rather than stuck on the dashboard.
    onSettled: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      }

      logout();
      queryClient.clear();
    },
  });
};

/**
 * Hook for fetching current user
 * @returns {Query}
 */
export const useCurrentUser = (enabled = true) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated && enabled,
    staleTime: 5 * 60 * 1000,
  });
};
