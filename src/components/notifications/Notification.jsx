import {useSelector} from 'react-redux';
import NotificationLayout from './cards/NotificationLayout';
import FeedDataPrizeTemplate from './cards/FeedDataPrizeTemplate';

import FeedDataPromoteProduct from './cards/FeedDataPromoteProduct';
import TemplateUnknown from './cards/TemplateUnknown';

export default function Notification({notification, template}) {
  const notificationData = notification.notificationData;
  const myLastRead = useSelector(state => state.sendbird.feedChannel.myLastRead);
  const isUnread = myLastRead < notification.createdAt;

  const InnerNotification = () => {

    console.log(template.data_template)
    
    if (notificationData.templateKey === 'feed-data-template') {
      console.log(notification.notificationData.templateVariables)
      return <FeedDataPrizeTemplate notification={notification} />;
    }
    
    if (notificationData.templateKey === 'new-promote-product-template' || notificationData.templateKey === 'new-promote-product-template-3'){ 
      return <FeedDataPromoteProduct notification={notification} template_data={template.data_template} />;
    }

    return <TemplateUnknown />;
  };

  return (
    <NotificationLayout isUnread={isUnread} createdAt={notification.createdAt} label={notificationData.label}>
      {InnerNotification()}
    </NotificationLayout>
  );
}
