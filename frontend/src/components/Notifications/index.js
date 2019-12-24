import React, { useState, useMemo, useEffect } from 'react';
import { MdNotifications, MdNotificationsOff } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import {
  Container,
  Badge,
  NotificationList,
  Notification,
  Scroll,
} from './styles';

export default function Notifications() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const hasUnread = useMemo(
    () => Boolean(notifications.find(n => n.read === false)),
    [notifications]
  );

  // useEffect(() => {
  //   async function loadingNotifications() {
  //     const response = await api.get('/notifications');

  //     const data = response.data.map(n => ({
  //       ...n,
  //       timeDistance: formatDistance(parseISO(n.createdAt), new Date(), {
  //         addSuffix: true,
  //         locale: pt,
  //       }),
  //     }));

  //     setNotifications(data);
  //   }

  //   loadingNotifications();
  // }, []);

  function handleToggleVisible() {
    if (notifications.length) {
      setVisible(!visible);
    } else {
      setVisible(false);
    }
  }

  async function handleMarkAsRead(id) {
    await api.put(`/notifications/${id}`);

    setNotifications(
      notifications.map(n => (n._id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <Container>
      <Badge
        onClick={handleToggleVisible}
        hasUnread={hasUnread}
        isEmpty={!notifications.length}
      >
        {notifications.length ? (
          <MdNotifications color="#EE4D64" size={20} />
        ) : (
          <MdNotificationsOff color="#EE4D64" size={20} />
        )}
      </Badge>

      <NotificationList visible={visible}>
        <Scroll>
          {notifications.map(n => (
            <Notification key={n._id} unread={!n.read}>
              <p>{n.content}</p>
              <time>{n.timeDistance}</time>
              {!n.read && (
                <button type="button" onClick={() => handleMarkAsRead(n._id)}>
                  Marcar como lida
                </button>
              )}
            </Notification>
          ))}
        </Scroll>
      </NotificationList>
    </Container>
  );
}
