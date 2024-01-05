import { ClientError } from '@errors/client.error';
import { PrismaLibrary } from '@libraries/common/prisma.lib';
import { ClientLogger } from '@utils/logger.util';

export const checkIsEmailExist = async (prisma: PrismaLibrary, email: string) => {
  try {
    const result = await prisma.client.findFirst({
      select: {
        uuid: true,
      },
      where: { email },
    });

    if (result !== null)
      throw new ClientError('[Signup] Check is Exisint Email', 'Found Existing Email. Please try different email');

    ClientLogger.debug('[Signup] No Email Found. Good to go: %o', {
      email,
    });

    return true;
  } catch (error) {
    ClientLogger.error('[Signup] Check is existing email: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ClientError(
      '[Signup] Check is Existing Email',
      'Check is Existing Email Error. Please Check Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
