/**
 * Authentication Types
 *
 * Type definitions for authentication functionality.
 */
/**
 * Authentication methods
 */
export var AuthMethod;
(function (AuthMethod) {
    /**
     * API key authentication
     */
    AuthMethod["API_KEY"] = "api_key";
    /**
     * OAuth authentication
     */
    AuthMethod["OAUTH"] = "oauth";
})(AuthMethod || (AuthMethod = {}));
/**
 * Authentication states
 */
export var AuthState;
(function (AuthState) {
    /**
     * Initial state
     */
    AuthState["INITIAL"] = "initial";
    /**
     * Authentication in progress
     */
    AuthState["AUTHENTICATING"] = "authenticating";
    /**
     * Successfully authenticated
     */
    AuthState["AUTHENTICATED"] = "authenticated";
    /**
     * Authentication failed
     */
    AuthState["FAILED"] = "failed";
    /**
     * Refreshing authentication
     */
    AuthState["REFRESHING"] = "refreshing";
    /**
     * Expired authentication
     */
    AuthState["EXPIRED"] = "expired";
    /**
     * Unauthenticated state
     */
    AuthState["UNAUTHENTICATED"] = "unauthenticated";
})(AuthState || (AuthState = {}));
// Define AuthState as a constant object with the same values
export const AuthStateValues = {
    INITIAL: AuthState.INITIAL,
    AUTHENTICATING: AuthState.AUTHENTICATING,
    AUTHENTICATED: AuthState.AUTHENTICATED,
    FAILED: AuthState.FAILED,
    REFRESHING: AuthState.REFRESHING,
    EXPIRED: AuthState.EXPIRED,
    UNAUTHENTICATED: AuthState.UNAUTHENTICATED,
};
//# sourceMappingURL=types.js.map