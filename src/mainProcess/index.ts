import ChannelAggregator from './ChannelAggregator';
import routes from './routes';

export default async () => {
  routes();

  ChannelAggregator.start();
};

// For debug
process.on('unhandledRejection', console.dir);
