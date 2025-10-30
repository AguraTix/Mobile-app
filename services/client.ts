import axios, { AxiosInstance, AxiosResponse, AxiosProgressEvent, CancelToken } from 'axios';
import { API_CONFIG } from './constants';
import { ApiResponse, ApiError, DownloadResponse } from '@/types';
import * as SecureStore from 'expo-secure-store';


class ApiClient {
    private axiosInstance: AxiosInstance;
    private logoutListeners: (() => void)[] = [];
    private isRefreshing = false;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}`,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    const token = await this.getAuthToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                } catch (error) {

                    return Promise.reject(error);
                }
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle errors
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                try {

                    if (error.response) {
                        const apiError: ApiError = {
                            status: error.status,
                            message: error?.message || 'An error occurred',
                            errors: error.errors,
                        };

                        throw apiError;
                    }
                    if (error.code === 'ECONNABORTED') {
                        throw new Error('Request timeout');
                    }

                    throw new Error('Network error');
                } catch (err) {
                    throw err
                }
            }
        );
    }

    private async getAuthToken(): Promise<string | null> {
        try {
            const token = await SecureStore.getItemAsync('auth_token');
            return token
        } catch (error) {
            this.logout();
            throw error
        }
    }

    public async logout() {
        try {

            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    throw error
                }
            });
        } catch (error) {
            throw error
        } finally {
            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    throw error
                }
            });
        }
    }

    public onLogout(callback: () => void) {
        try {
            this.logoutListeners.push(callback);
        } catch (error) {
            throw error
        }
    }

    public removeLogoutListener(callback: () => void) {
        try {
            this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback);
        } catch (error) {
            throw error
        }
    }

    async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { params })
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {

            throw error;
        }
    }

    async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {

            throw error;
        }
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.patch<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {

            throw error;
        }
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint);
            return response.data;
        } catch (error) {

            throw error;
        }
    }

    async downloadFile(
        endpoint: string,
        options: {
            responseType?: 'blob' | 'arraybuffer' | 'stream' | 'text';
            headers?: Record<string, string>;
        } = { responseType: 'arraybuffer' }
    ): Promise<DownloadResponse> {
        try {
            // Request the response as an array buffer
            const response = await this.axiosInstance.get<ArrayBuffer>(endpoint, {
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'application/pdf',
                    ...options.headers
                }
            });

            // Extract filename from content-disposition header
            const contentDisposition = response.headers['content-disposition'] || '';
            const contentType = response.headers['content-type'] || 'application/pdf';

            let filename = 'report.pdf';
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }

            // Convert ArrayBuffer to base64 string using base-64
            const binaryString = Array.from(new Uint8Array(response.data))
                .map(byte => String.fromCharCode(byte))
                .join('');
            const base64Data = btoa(binaryString);

            return {
                data: base64Data,
                filename,
                contentType
            };
        } catch (error: unknown) {
            throw error;
        }
    }

    async uploadFile<T>(
        endpoint: string,
        fileUri: string,
        onUploadProgress?: (event: AxiosProgressEvent) => void,
        cancelToken?: CancelToken,
        timeout?: number
    ): Promise<ApiResponse<T>> {
        try {
            // extract filename from uri
            const filename = fileUri.split("/").pop() ?? "upload.jpg";

            // detect file extension
            const ext = filename.split(".").pop()?.toLowerCase();

            // basic mime detection
            let type = "image/jpeg";
            if (ext === "png") type = "image/png";
            else if (ext === "jpg" || ext === "jpeg") type = "image/jpeg";
            else if (ext === "gif") type = "image/gif";

            const formData = new FormData();
            formData.append("file", {
                uri: fileUri,
                type,
                name: filename,
            } as any);

            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress,
                cancelToken,
                timeout: timeout ?? API_CONFIG.TIMEOUT,
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const client = new ApiClient();
