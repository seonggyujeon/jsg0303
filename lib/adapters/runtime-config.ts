import {env} from "cloudflare:workers";

export function optionalRuntimeSecret(name:string):string|null{
  const value=(env as unknown as Record<string,unknown>)[name];
  return typeof value==="string"&&value.trim()?value:null;
}
