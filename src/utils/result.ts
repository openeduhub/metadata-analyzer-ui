import { Observable, of, pipe, UnaryFunction } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class Result<T> {
    static Ok<T>(ok: T) {
        return new Result({ kind: 'ok', ok });
    }

    static Err<T>(err: any) {
        return new Result<T>({ kind: 'err', err });
    }

    private constructor(
        private readonly value: { kind: 'ok'; ok: T } | { kind: 'err'; err: any },
    ) {}

    isOk(): boolean {
        return this.value.kind === 'ok';
    }

    isErr(): boolean {
        return this.value.kind === 'err';
    }

    ok(): T | null {
        return this.value.kind === 'ok' ? this.value.ok : null;
    }

    err(): any | null {
        return this.value.kind === 'err' ? this.value.err : null;
    }

    unwrap(): T {
        if (this.value.kind === 'ok') {
            return this.value.ok;
        } else {
            throw new Error(this.value.err);
        }
    }

    map<R>(f: (value: T) => R): Result<R> {
        if (this.value.kind === 'ok') {
            return Result.Ok(f(this.value.ok));
        } else {
            return (this as unknown) as Result<R>;
        }
    }
}

export function wrapAsResult<T>(): UnaryFunction<Observable<T>, Observable<Result<T>>> {
    return pipe(
        map((value: T) => Result.Ok(value)),
        catchError((err) => of(Result.Err<T>(err))),
    );
}
