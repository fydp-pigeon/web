'use client';

import { Spinner } from '@/_components/Spinner';
import { ToastType } from '@/_components/Toast';
import { Input } from '@/_components/inputs/Input';
import { useToast } from '@/_hooks/useToast';
import { signIn } from '@/_lib/client/signIn';
import { callBackend } from '@/_lib/client/callBackend';
import { ApiSignUpBody, ApiSignUpResp } from '@/api/signup/_lib/signUp';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { InlineLink } from '@/_components/inputs/InlineLink';

export function SignupForm() {
  const showToast = useToast();

  // Form data
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();

  // Form errors
  const [isErrorEmail, setIsErrorEmail] = useState<boolean>();
  const [isErrorName, setIsErrorName] = useState<boolean>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignedUp, setIsSignedUp] = useState<boolean>();

  const onSubmit = async () => {
    try {
      if (isSignedUp || isLoading) {
        return;
      }

      setIsLoading(true);
      const [type, text] = ['danger' as ToastType, 'Please fill in all required fields.'];

      if (!email) {
        setIsErrorEmail(true);
        showToast({ type, text });
      }

      if (!name) {
        setIsErrorName(true);
        showToast({ type, text });
      }

      if (!email || !name) {
        return;
      }

      await callBackend<ApiSignUpResp, ApiSignUpBody>({
        url: '/api/signup',
        method: 'POST',
        body: {
          email,
          name,
        },
      });

      showToast({ type: 'success', text: 'Success!' });

      await signIn({ email });

      setIsSignedUp(true);
    } catch (error) {
      console.error(error);
      showToast({
        type: 'danger',
        text: 'Something went wrong: ' + error,
      });
    }

    setIsLoading(false);
  };

  if (isSignedUp) {
    return (
      <div className="mt-3 flex w-full flex-col items-center gap-3 px-5">
        <CheckCircleIcon height={80} className="text-success" />
        <div className="space-y-1">
          <div className="w-full text-xl font-semibold">Check your email</div>
          <div className="text-md">
            Please check your email inbox (make sure to check your junk folder) and click on the provided link to sign
            in. If you don&apos;t recieve an email, {/* TODO: Debounce resend */}
            <InlineLink href="#" onClick={() => signIn({ email: email! })}>
              click here to resend.
            </InlineLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onSubmit();
        }
      }}
    >
      {/* <div className="mt-3 text-sm">
        
      </div> */}
      <div className="space-y-6">
        <Input label="Email" isError={isErrorEmail} value={email} onChange={setEmail} required />
        <Input label="Name" isError={isErrorName} value={name} onChange={setName} required />
      </div>
      <div className="pt-3">
        <button className="btn-neutral btn w-24" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <Spinner /> : 'Sign up'}
        </button>
      </div>
      <div className="pt-1 text-sm">
        Already have an account? <InlineLink href="/signin">Sign in.</InlineLink>
      </div>
    </div>
  );
}
