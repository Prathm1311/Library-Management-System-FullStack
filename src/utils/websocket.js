// WebSocket utility - gracefully handles connection failures
export function setupWebSocket(callback) {
  // Use setTimeout to avoid blocking initial render
  setTimeout(() => {
    import('sockjs-client')
      .then((SockJSModule) => {
        return import('stompjs').then((StompModule) => {
          const SockJS = SockJSModule.default || SockJSModule
          const Stomp = StompModule.default || StompModule
          
          if (!SockJS || !Stomp) {
            console.warn('WebSocket libraries not available')
            return
          }
          
          try {
            const socket = new SockJS('/ws')
            const stompClient = Stomp.over(socket)
            
            // Disable debug logging
            if (stompClient.debug) {
              stompClient.debug = () => {}
            }
            
            stompClient.connect({}, () => {
              stompClient.subscribe('/topic/updates', () => {
                if (callback && typeof callback === 'function') {
                  callback()
                }
              })
            }, (error) => {
              console.warn('WebSocket connection error (non-critical):', error)
            })
          } catch (error) {
            console.warn('WebSocket setup error (non-critical):', error)
          }
        })
      })
      .catch((err) => {
        // Silently fail - WebSocket is optional
        console.warn('WebSocket libraries not available (non-critical)')
      })
  }, 1000) // Delay to not block initial render
}
